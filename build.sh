#!/bin/sh
npm i
npm run build
npm run seed:prod:run
screen -X -S site_run_prod_back quit
screen -S site_run_prod_back -d -m npm run start:prod