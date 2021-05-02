#!/usr/bin/env bash
cd backend || exit
./dependencies.sh
cd ..
cd frontend || exit
./dependencies.sh
