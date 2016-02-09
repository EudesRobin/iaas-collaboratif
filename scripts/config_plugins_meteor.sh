#!/bin/bash

cd meteor-frontend

# remove unused plugins
meteor remove blaze-html-templates
meteor remove ecmascript

#add needed plugins
meteor add angular
meteor add mouse0270:bootstrap-notify