#!/bin/bash

PROJECT="herd"
LOGIN="peter@writtenwordinteractive.com"

./node_modules/.bin/ng build --prod || exit

ssh $LOGIN "rm /tmp/$PROJECT.writtenwordinteractive.com-old/ -R"
ssh $LOGIN "mkdir -p /tmp/$PROJECT.writtenwordinteractive.com-new"
scp -r dist/herd-immunity-demo/* $LOGIN:/tmp/$PROJECT.writtenwordinteractive.com-new/
ssh $LOGIN "mv sites/$PROJECT.writtenwordinteractive.com /tmp/$PROJECT.writtenwordinteractive.com-old && mv /tmp/$PROJECT.writtenwordinteractive.com-new sites/$PROJECT.writtenwordinteractive.com"
