Data = new ReactiveDict;

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    c = Data.get('greeting');
    if(c){
        return c;
    }
    else{
        Data.set('greeting','Hallo');
        return 'Hallo';
    }

  };

  Template.hello.events({
    'keyup input': function (e) {
      console.log(e);
      Data.set('greeting', e.currentTarget.value);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
