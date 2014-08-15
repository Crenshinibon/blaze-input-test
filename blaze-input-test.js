Data = new Meteor.Collection('data');

if (Meteor.isClient) {

    State = new ReactiveDict;
    State.set('ready',false);

    Deps.autorun(function () {
        Meteor.subscribe('data',function() {
            _inputGreeting = Data.findOne({type: 'greeting'}).greeting;
            State.set('ready',true);
        })});

    _storedGreeting = function () {
        if(State.get('ready')) {
            var c = Data.find({type: 'greeting'});
            if (c.count() > 0) {
                return c.fetch()[0].greeting;
            }
            else {
                Data.insert({type: 'greeting', greeting: 'Hallo'});
                _inputGreeting = 'Hallo';
                return 'Hallo';
            }

        }
        else{
            return '...loading...';
        }
    };

    var _inputGreeting = undefined;
    var _counter = 0;
    Template.hello.greetingScope = function () {
        _counter += 1;

        var scopeData = new ReactiveDict;
        scopeData.set('hasFocus',false);
        scopeData.set('concurrent',false);

        var fieldId = "g" + _counter;
        var scope = {
            fieldId: fieldId,
            data: scopeData,
            greeting: function () {
                if(this.data.get('hasFocus') === false){
                    return _storedGreeting();
                }
                else {
                    return _inputGreeting;
                }
            },
            focus: function() {
                this.data.set('hasFocus',true);
            },
            blur: function() {
                this.data.set('hasFocus',false);
            },
            concurrent: function() {
                var self = this;
                self.data.set('concurrent', _inputGreeting !== _storedGreeting());
                return this.data.get('concurrent') && this.data.get('hasFocus');
            }

        };
        return scope;
    };

    Template.hello.greeting = function () {
        return this.greeting();
    };


    Template.hello.events({
        'keyup input': function (e) {
            _inputGreeting = e.currentTarget.value;
            id = Data.findOne({type: 'greeting'})._id;
            Data.update({_id: id},{$set: {greeting: _inputGreeting}});
        },
        'focus input': function () {
            this.focus();
        },
        'blur input': function () {
            this.blur();
        }

    });

}

if (Meteor.isServer) {
    Meteor.publish('data', function(){
        return Data.find({});
    });

    Meteor.startup(function () {
        // code to run on server at startup
    });
}
