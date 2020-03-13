
    var ArrayExecuter = function (scope, id) {
        this.task_arr = [];
        this.defaultScope = scope || this;
        this.id = id || '';
        this.verbose = false;
    }

    ArrayExecuter.prototype = {
        //Exectutes an array of functions
        //If this is called and another array is currently executing, then
        //the new set of functions will run before finishing the previous set
        execute: function (arr) {
            if(this.verbose)console.log("ArrayExecuter | "+this.id+" | execute");
            this.addNext(arr);
            this.runStep('');
        },
        addNext: function (arr) {
            if(this.verbose)console.log("ArrayExecuter | "+this.id+" | addNext");
            if (typeof arr === 'function') {
                // add single function
                this.task_arr.unshift({fn: arr, vars: null});
            } else {
                // add elements from array
                arr.reverse();

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]) {
                        this.task_arr.unshift(arr[i]);
                    }
                }
            }
        },
        tackOn: function (arr) {
            if(this.verbose)console.log("ArrayExecuter | "+this.id+" | tackOn");
            for (var i=0; i<arr.length; i++) {
                this.task_arr.push(arr[i]);
            }

            this.runStep('');
        },
        runFunctionInScope: function (arr) {
            var obj = arr[0];
            var function_name = arr[1];
            var optionalVars = (arr.length >2)?arr[2]:null;

            if (arr.length >2) {
                obj[function_name](arr[2]);
            } else {
                obj[function_name]();
            }
        },
        runStep: function (args) {
            if(this.verbose)console.log("ArrayExecuter | "+this.id+" | runStep");

            if (this.task_arr.length == 0)return;

            var step = this.task_arr.shift();
            var funct = step.fn;

            step.scope = step.scope || this.defaultScope;
            step.vars = step.vars || [];

            if (typeof step.vars === "string") {
                step.vars = [step.vars];
            }

            funct.apply(step.scope, step.vars);

            nullObj(step);
        },
        stepComplete: function (args) {
            if(this.verbose)console.log("ArrayExecuter | "+this.id+" | stepComplete");

            if (this.task_arr.length > 0) {
                window.requestAnimationFrame(this.runStep.bind(this));
            }

        },
        stepComplete_instant: function (args) {
            if(this.verbose)console.log("ArrayExecuter | "+this.id+" | stepComplete_instant");

            if (this.task_arr.length > 0) {
                this.runStep();
            }
        },
        clearArrayExecuter: function () {
            if(this.verbose)console.log("ArrayExecuter | "+this.id+" | clearArrayExecuter");
            this.task_arr = [];
        },
        destroy: function () {
            for (var i = 0; i < this.task_arr.length; i++) {
                nullObj(this.task_arr[i]);
            };
            this.task_arr = [];
            this.defaultScope = null;
        }
    }

    function nullObj (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                obj[prop] = null;
            }
        }
        obj = null;
    }
/*
     FILE ARCHIVED ON 04:39:52 May 24, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:22:54 Mar 13, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots: 0.233
  PetaboxLoader3.datanode: 436.659 (4)
  PetaboxLoader3.resolve: 78.495
  RedisCDXSource: 0.737
  esindex: 0.016
  load_resource: 190.918
  captures_list: 440.844
  CDXLines.iter: 14.254 (3)
  exclusion.robots.policy: 0.217
  LoadShardBlock: 420.631 (3)
*/