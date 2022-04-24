var h = ajuc.hierarchy;
var to1 = new h.TypedObject(1);
var e1 = new h.Entity(2);
var s1 = new h.Ship(3);
var p1 = new h.Player(4);
var p2 = new h.Player(5);

p1.ammo[0] = 15;
p2.ammo[0] = 13;

var toSerialize = [to1, e1, s1, p1, p2];

var serialized = JSON.stringify(toSerialize);

var deserialized = JSON.parse(serialized);
var i;
var n = deserialized.length;

for (i=0; i<n; i++) {
	deserialized[i] = h.prototypize(deserialized[i]);
}

