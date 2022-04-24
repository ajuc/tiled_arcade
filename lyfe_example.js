 var test = Generator(function () {
     this.yield("Hello");
     if (false)
         this.yield("ignore me");
     for (var i = 0; i < 6; i++)
         this.yield(" world".substr(i, 1));
 });

 var test2 = Generator(["!"]);

 var array = test.and(test2).map(function (s) { return s.toUpperCase(); }).toArr

 alert(array.join("")); // "HELLO WORLD!"
