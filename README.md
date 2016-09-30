# quick-log
Log every thing to the specified file.
You can also logs by queue. This way all logs will be printed together.

#### Example

```
'use strict';

const quickLog = require('./index');
const fileLogger = quickLog.fileLogger;
const QueueLog = quickLog.QueueLog;

// Set config (Do this on the init file of your application)
quickLog.setConfig({
  logPath: './log/'
});

// Log normal message
fileLogger.log('Yes test');

// Log error
fileLogger.error({name: 'hello world'});

const queueLog = new QueueLog({
  referenceId: 'test-log',
  referenceName: 'Display',
  processId: true
});

const logs = [1, 'test log', 'an other log'];
let intervals = 0;

// Async example
const interval = setInterval(() => {
  intervals++;
  logs.forEach((itemToLog, i) => {
    queueLog.log(`Interval ${intervals}: This is a log item: ${itemToLog} - ${i}`);
  });

  if (intervals >= 3) {
    clearInterval(interval);

    // Write the log when your done with your async calls
    queueLog.write(); // or pass 'error' to display as an error
  }
}, 500);

// Output
/*
 2016-09-30 12:14:43 (NORMAL) - Yes test
 2016-09-30 12:14:43 (ERROR) - { name: 'hello world' }
 2016-09-30 12:14:43 - sWExaCCatY - --------- INIT Display ( test-log ) ---------
 2016-09-30 12:14:44 - sWExaCCatY - Interval 1: This is a log item: 1 - 0
 2016-09-30 12:14:44 - sWExaCCatY - Interval 1: This is a log item: test log - 1
 2016-09-30 12:14:44 - sWExaCCatY - Interval 1: This is a log item: an other log - 2
 2016-09-30 12:14:44 - sWExaCCatY - Interval 2: This is a log item: 1 - 0
 2016-09-30 12:14:44 - sWExaCCatY - Interval 2: This is a log item: test log - 1
 2016-09-30 12:14:44 - sWExaCCatY - Interval 2: This is a log item: an other log - 2
 2016-09-30 12:14:45 - sWExaCCatY - Interval 3: This is a log item: 1 - 0
 2016-09-30 12:14:45 - sWExaCCatY - Interval 3: This is a log item: test log - 1
 2016-09-30 12:14:45 - sWExaCCatY - Interval 3: This is a log item: an other log - 2
 2016-09-30 12:14:45 - sWExaCCatY - --------- (NORMAL)  END Display ( test-log ) ---------
 */
```

