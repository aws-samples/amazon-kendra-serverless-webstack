#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { KendraQueryApiStack } from '../lib/kendra-query-api-stack';

const app = new cdk.App();
new KendraQueryApiStack(app, 'KendraQueryApiStack');
