#!/bin/bash

for i in {1..100}
do
  /bin/node ./dist/client/client.js &
done
