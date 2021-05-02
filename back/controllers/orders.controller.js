const fs = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { off } = require('../app');
const FILE_PATH = '../data/dataStorage.json';

dotenv.config();

const API_KEY = process.env.API_KEY;
const METHODS_RULES = process.env.METHODS_RULES;
const OFF_DAYS = process.env.OFF_DAYS;

function epoch(date) {
  return Date.parse(date);
}
function getRandomInt(max) {
  let random = Math.floor(Math.random() * max).toString();
  if (random < 10) {
    return '00' + random;
  } else if (random < 100) {
    return '0' + random;
  }
  return random;
}
function readData() {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, FILE_PATH), 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeData(order, data) {
  try {
    if (!fs.existsSync(path.resolve(__dirname, '../data'))) {
      fs.mkdirSync(path.resolve(__dirname, '../data'));
    }
    data.push(order);
    fs.writeFileSync(path.resolve(__dirname, FILE_PATH), JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}
function ordersList(req, res) {
  try {
    const data = readData();
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: 'Page not found' });
  }
}
function getOrder(req, res) {
  try {
    const data = readData();
    const one = data.filter((order) => {
      return order.orderID === req.params.id;
    });
    if (one.length !== 0) {
      res.status(200).json(one);
    } else {
      res.status(400).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error(err);
  }
}
async function getRules(method) {
  const rule = await axios.get(METHODS_RULES + `${method.toString()}`, {
    headers: { 'x-api-key': API_KEY },
  });
  return rule.data;
}
async function getOffDays() {
  const offDays = await axios.get(OFF_DAYS, {
    headers: { 'x-api-key': API_KEY },
  });
  return offDays.data;
}
function calculate(date, promise, businessDays) {
  if (promise.type === 'DELTA-HOURS') {
    const dateTime = new Date(date);
    dateTime.setUTCHours(dateTime.getUTCHours() + promise.deltaHours);
    return dateTime.toUTCString();
  } else if (promise.type === 'DELTA-BUSINESSDAYS') {
    let dateTime = new Date(date);
    if (promise.deltaBusinessDays === 0) {
      dateTime.setUTCHours(dateTime.getUTCHours() + promise.deltaHours);
      return dateTime.toUTCString();
    }
    dateTime = new Date(businessDays[promise.deltaBusinessDays - 1]);
    dateTime.setUTCHours(dateTime.getUTCHours() + promise.timeOfDay);
    return dateTime.toUTCString();
  }
  return null;
}
function promiseCalculator(date, order, rule, businessDays) {
  order['promises'] = {
    packPromiseMin: calculate(date, rule.packPromise.min, businessDays),
    packPromiseMax: calculate(date, rule.packPromise.max, businessDays),
    shipPromiseMin: calculate(date, rule.shipPromise.min, businessDays),
    shipPromiseMax: calculate(date, rule.shipPromise.max, businessDays),
    deliveryPromiseMin: calculate(date, rule.deliveryPromise.min, businessDays),
    deliveryPromiseMax: calculate(date, rule.deliveryPromise.max, businessDays),
    readyPickupPromiseMin: calculate(
      date,
      rule.readyPickUpPromise.min,
      businessDays
    ),
    readyPickupPromiseMax: calculate(
      date,
      rule.readyPickUpPromise.max,
      businessDays
    ),
  };
  return order;
}
function addDays(dateObj, numDays) {
  return dateObj.setDate(dateObj.getDate() + numDays);
}
function addBusinessDas(offDays, date) {
  const businessDays = [];
  const day = new Date(date);
  const days = 1;
  addDays(day, days);
  while (businessDays.length < 10) {
    if (
      offDays.includes(day.toISOString().slice(0, 10)) ||
      day.getDay() === 6
    ) {
      addDays(day, days);
      continue;
    }
    businessDays.push(day.toISOString().slice(0, 10));
    addDays(day, days);
  }
  return businessDays;
}
function calculateTotalWeight(items) {
  const total = items.reduce((acc, item) => acc + item.weight, 0);
  return total;
}
function verifyWithRule(weight, weightRule) {
  if (weightRule.min <= weight && weight <= weightRule.max) {
    return true;
  }
  return false;
}
function verifyDayType(date, dayType, offDays) {
  if (dayType.dayType === 'ANY') {
    return true;
  } else {
    if (
      offDays.includes(date.toISOString().slice(0, 10)) ||
      date.getDay() === 6
    ) {
      return false;
    }
  }
  return true;
}
function verifyTime(date, byRequestTime) {
  if (
    byRequestTime.fromTimeOfDay <= date.getUTCHours() &&
    date.getUTCHours() <= byRequestTime.toTimeOfDay
  ) {
    return true;
  }
  return false;
}
async function createOrder(req, res) {
  try {
    /** Read the orders to create a new object in the json */
    const data = readData();

    /** Receive the input from the user */
    let order = await req.body;
    order.orderInfo.shippingMethod = parseInt(order.orderInfo.shippingMethod);

    /**Date to manipulate */
    const date = new Date();

    /** Create the orderID */
    order['orderID'] = epoch(date).toString() + getRandomInt(100);

    /** Retrieve shipping method details */
    const rule = await getRules(order.shippingMethod);

    /** Add to the order the Creation Date */
    order['creationDate'] = date.toISOString().slice(0, 10);

    /** Get the list of the OffDays */
    const offDays = await getOffDays();

    /** Create the Array of the 10 Next Business Days */
    const nextBusinessDays = addBusinessDas(offDays, date);

    /** Calculate the total weight of the Order */
    const weight = calculateTotalWeight(order.orderInfo.items);
    if (!verifyWithRule(weight, rule.rules.availability.byWeight)) {
      res.status(409).json({ message: 'Overweight' });
      return;
    }

    /** Validate the Day Type ANY or BUSINESS */
    if (!verifyDayType(date, rule.rules.availability.byRequestTime, offDays)) {
      res.status(409).json({ message: 'Not Business Day' });
      return;
    }
    /** Validate time of day */
    if (!verifyTime(date, rule.rules.availability.byRequestTime)) {
      res.status(409).json({ message: 'Not time available' });
      return;
    }
    /** Case priority */
    let i = 0;
    while (i < rule.rules.promisesParameters.cases.length) {
      /** Validate the Day Type ANY or BUSINESS of Priority */
      if (
        !verifyDayType(
          date,
          rule.rules.promisesParameters.cases[i].condition.byRequestTime,
          offDays
        )
      ) {
        i++;
        continue;
      }
      /** Validate time of day */
      if (
        !verifyTime(
          date,
          rule.rules.promisesParameters.cases[i].condition.byRequestTime
        )
      ) {
        i++;
        continue;
      }
      break;
    }

    order = await promiseCalculator(
      date,
      order,
      rule.rules.promisesParameters.cases[i],
      nextBusinessDays
    );
    writeData(order, data);
    res
      .status(201)
      .json({ message: 'Sell order created successfully', data: order });
  } catch (err) {
    console.error(err);
  }
}

module.exports = { ordersList, getOrder, createOrder };
