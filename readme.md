# Compose SVG Blocks: An experiment on Data Visualization

When I was still in Fujitsu,
once I faced with some problems when writing a few Data visualizing widgets:

1. I needed a graph that was not implemented by the current graph lib; 
  And add one myself is not easy.   
2. I needed to configure a large object to create a graph, While it's undocumented;
3. I want to control some certain detail, but there's not option for that.

Actually, These are common flaws of current data visualization tools on web.

With the current tools you can reach, you will probably create a line chart like this:
```Javascript
const myChart = new LineChart({
  height: ...,
  witdh: ...,
  lineCololr: ...,
  data: {
    ...
  }
  //... 1000 more other options
})
```

And when you need a specialized chart, your face :

(｀□′)╯┴┴ 

Data visualization tools are quite different from other libraries.
When you're writing a web server, 
following the framework's design would hardly make any difference.
But most charts are highly specialized.

Less is more.
You hide less, and the users get more freedom. 

That's why D3.js is so powerful and popular.

But D3 has its own problems, say:
- it is not that easy to learn; 
- it is too heavy (luckily, now you can pack it yourself with your desired parts);
- it operates on real node;
- it needs your extra work to work with React or other frameworks;
- ...


So this is an experiment to explore how to create:
- easy to learn
- easy to scale
- easy to port

data visualization solution.

__The basic philosophy is to simulate how human handle such problems.__

Say I need a line chart,
I may do it this way before PC is invented:
1. Draw an axis set
2. change the data to points
3. Link the points on my axis set

![steps](/assets/manual-steps.png)
 
How about reproduce it in JavaScript?
```JavaScript
const axis = createAxisSet(myOptions)
const line = createLine(myData)
const chart = createChart([axis, line])

mount('#root', chart)
```

Here is a problem, 
how can I know what the user want if I provide the `createAxisSet` function?
The solution is easy:

Do not provide. Let users write it themselves.

The axis set consists of a set of lines, so it can be:
```JavaScript
const xAxis = createLine(...)
const yAxis = createLine(...)
const tags = map(t => createText(t, ...) , myTags)

const myAxis = combine(xAxis, yAxis, tags)
```

The length, height, colors and other styles, all these options, the user will decide them.

Then what will the lib do?

__Provide a set of SVG virtual node creators and operators.__

That is, offer a pen, and let the user decide what to draw.

A SVG shape element matches to at least one virtual node;
Each kind of virtual node has a set of operators,
most of which are geometric transformers, like `move` or `rotate`.

Then the procedure of drawing a y-axis of 400 pixels, 
can be described as below:
```JavaScript
//determine styles, e.g. stroke width, color ...
const attrs = {
  'stroke': 'black',
  'stroke-width': 1 
}

//create a polyline from (0,0) to (-0,-400)  
const _y = Polyline.create(attrs, [[0, 0], [0, -400])

//move it to the right place, e.g.(50,500)
const y = Polyline.moveBy(50, 500, _y)

//other operations, e.g. add it to a group or port to real DOM node
...
```


You can get a full example [here](/example).

## FAQ

Q: _Why not use SVG DOM directly?_ 

A: Real DOM is quite heavy,
using virtual node is for performance concern.

Q: _So this is another HyperScript?_

A: It is partly inspired by HyperScript. 
You can view it as HyperScript + Geometric Operators.
Another difference is that, HyperScript produce real Node,
But here you'll get virtual node.

Q: _Then what's the meaning if you just offer basic SVG. Libs are for reuse, Right?_

A: Libs are for reuse, when you know what to reuse. 
Then what can you do when you don't know?
I believe it is better for the chart designer to decide which part to reuse.
And what we can do is to offer an easy access to make your own reuseable chart.

Q: _Any more highlights?_

A: There are several highlight points I want to mention:  
1. Type checking. It is really annoying when you get an error 
"attribute xxx: expect length, got NaN".
So every parameter is type checked before the operation begins.
2. Pure error handling. Type checking would produce many error messages.
How to handle these messages is a problem.
Throwing them is not a good idea. 
So an Either Monad is invoked to hold either a shape or a error message.
3. Curry function for resuse.
It is personal preference. But it's comfortable if you get used to currying.
For example, you need to create a set of bars in the same style, 
then you can just write:

 ```JavaScript
  // Rect.create : Object -> Number -> Number -> Number ->Number -> Rect

  // myBar : Number->Number->Number->Rect
  const myBar = Rect.create(myStyle) 
  //bar1 : Rect
  const bar1 = myBar(x, y, height, width)
 ```
4. Easy to cooperate with other frameworks.
The structure of virtual node is quite simple, 
the current design is :
  ```JavaScript
  const vNode = {
    tag, // String
    attrs, // Object
    children, // Array<VNode|VText>, VText means virtual text node
  }
  ```
  No matter the target is DOM, virtual DOM or React, Angular, 
  the porting work is quite easy.
  So cross project sharing would be ever easy.

