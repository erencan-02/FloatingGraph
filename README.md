# FloatingGraph

[![p5](https://p5js.org/assets/img/p5js.svg)](https://p5js.org/)

[FloatingGraph](https://erencan-02.github.io/FloatingGraph/) is a small visualization tool of Nodes floating in space.


## Customizable Parameters

These can be changed by opening the Browser console with `f12`. Start by clicking and dragging your mouse on the Screen.


## Speed

| Parameter | Type | Semantics |
| --- | --- | --- | 
|LOWER_SPEED_BOUND | double | Min. speed of a node|
|UPPER_SPEED_BOUND | double | Max. speed of a node|


## Node Parameters

| Parameter | Type | Semantics |
| --- | --- | --- | 
|NODE_RADIUS | int | The size of a single node|
|NODE_RANGE  | int | Threshhold for creating an edge|
|MAX_NEIGHBOUR_COUNT  | int | Max. no. of outgoing edges of a single Node|
|MAX_NODE_COUNT | int | Max. no. of nodes |


## Visuals

| Parameter | Type | Semantics |
| --- | --- | --- | 
|NODE_COLOR | array [R, G, B] | Node color|
|EDGE_COLOR | array [R, G, B] | Edge color|
|BG_COLOR| 	  array [R, G, B] | Background color|


## Function

| Parameter | Input | Return Type | Semantics |
| --- | --- | --- | --- |
|randomizeSpeed | none | void | Randomizes the speed of all nodes |
|randomSpeed | none | int | Returns a random Speed within the boundaries |
|addRandomNodes | int | void | Adds randomly generated nodes |
|removeNodes | int | void | Removes nodes |
|removeAll | none | none | Removes all nodes |


## Additional Features
vat partyLoghts = false;


## Example
Overwriting the function `randomizeSpeed` would look like this:

```js
randomizeSpeed = () => {
	nodes.forEach((n) => {
		n.setSpeedX(2);
		n.setSpeedX(-1);
	})
};
```
