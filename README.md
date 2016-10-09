# HandyList
```
node: 6.5.0,
npm: 3.10.3
```
#For demonstration

## Environment
You need grunt and http-server packages globaly installed
```
npm -g install http-server
npm -g install grunt-cli
```

## Building
Go to the project dir and run
```
npm i
grunt
```

## Launch
Go to the project dir (dist) and run
```
http-server
```
end other cmd go to the project dir (dist) and run
```
node index.js
```
Go to browser [localhost:8080](localhost:8080)

#For use

Main file of widget - src/public/js/HandyList.js

Create an instance of the widget
```javascript
var handyList = new HandyList(options);
```

In the options you must set the mandatory parameters:
```
**items** - array of elements list
**sort** - options of sorting
**sort.index** - which field use to sort
```

and optional parameters:
```
**sort.type** - "date" or "string" (default - "string")
**sort.head** - "day" or "month" or "year" for sort type "date" (default - "month") or Number > 0 for sort type "string" (default - 1)
**sort.dateType** - "string" or "number" for sort type "date" (default - "number")
**sort.dateFormat** - "short" or "long" for sort type "date" (default - "short")
```