#!/bin/bash
cd src/db
yarn exec sequelize db:migrate
cd ../../
