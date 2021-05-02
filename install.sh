#!/usr/bin/env bash
cd back || exit
./dependencies.sh
cd ..
cd front || exit
./dependencies.sh
