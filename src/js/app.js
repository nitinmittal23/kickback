App = {
  web3Provider: null,
  contracts: {},
  web3js: null,
  
  init: function() {
    return App.initWeb3();
  },
  
  initWeb3: async function() {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window['ethereum']
    }
    App.web3js = new Web3 (App.web3Provider)
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('kickback.json', function(data) {
      var kickbackArtifact = data;
      App.contracts.kickback = TruffleContract(kickbackArtifact);
      App.contracts.kickback.setProvider(App.web3Provider);
      App.getMyAccount();
      App.getAllAccount();
      App.getAllwinner();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#yesButton', App.handleYes);
    $(document).on('click', '#noButton', App.handleNo);
  },

  getMyAccount: function() {
    console.log("getting my account")
    var kickbackInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }   
      var account = accounts[0];
      App.contracts.kickback.deployed().then(function(instance) {
        kickbackInstance = instance;    
        return kickbackInstance.getaccount(account);
      }).then(function(result) {
        $('#myAddress').text(result[0]);
        $('#myName').text(result[1]);
        $('#totalCount').text(result[2]);
        $('#totalFailure').text(result[3]);
        $('#start').text(result[4]);
        $('#end').text(result[5]);
        $('#myEligibility').text(result[6]);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleYes: function(event) {
    event.preventDefault();
    var name = $('#name').val();
    var kickbackInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      } 
      var account = accounts[0];
      App.contracts.kickback.deployed().then(function(instance) {
        kickbackInstance = instance;
        return kickbackInstance.updateData(account, name, {from: account, gas:600000});
      }).then(function(result) {
        alert("Thankyou For completing the challenge");
        App.getMyAccount();
        App.getAllAccount();
        App.getAllwinner();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleNo: function(event) { 
    event.preventDefault();
    var name = $('#name').val();
    var kickbackInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.kickback.deployed().then(function(instance) {
        kickbackInstance = instance;
        return name;
      }).then(function(result) {
        alert(Result + " you have not completed the challenge yet");
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getAllAccount: function() {
    console.log('Getting all Accounts');
    var kickbackInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.kickback.deployed().then(function(instance) {
        kickbackInstance = instance;   
        var tokenrow = $('#all-tokens-1');  
        $("#all-tokens-1").empty();
        return kickbackInstance.getAlladdress();  
      }).then(function(data) {
        for (i=0; i<data.length; i++){
          kickbackInstance.getaccount(data[i])
          .then(function(result){
            var tokenrow = $('#all-tokens-1');
            var tokenTemplate = $('#template-1');
            tokenTemplate.find('#AllAddress').text(result[0]);
            tokenTemplate.find('#AllName').text(result[1]);
            tokenTemplate.find('#AlltotalCount').text(result[2].toNumber());
            tokenTemplate.find('#AlltotalFailure').text(result[3].toNumber());
            tokenTemplate.find('#allEligibility').text(result[6]);
            tokenrow.append(tokenTemplate.html());
          })
          .catch(function(err) { 
            console.log(err.message);
          });
        } 
      })
      .catch(function(err) {
        console.log(err.message);
      });
    });
  },

 getAllwinner: function() {
    console.log('Getting winners...');
    var kickbackInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.kickback.deployed().then(function(instance) {
        kickbackInstance = instance;
        var tokenrow = $('#all-tokens-2');
        $("#all-tokens-2").empty();
        return kickbackInstance.winners();   
      }).then(function(data) {
        for (i=0; i<data.length; i++){
          kickbackInstance.getaccount(data[i])
          .then(function(result){
            var tokenrow = $('#all-tokens-2');
            var tokenTemplate = $('#template-2');
            tokenTemplate.find('#AllAddress').text(result[0]);
            tokenTemplate.find('#AllName').text(result[1]);
            tokenTemplate.find('#AlltotalCount').text(result[2].toNumber());
            tokenTemplate.find('#AlltotalFailure').text(result[3].toNumber());
            tokenrow.append(tokenTemplate.html());
          })
          .catch(function(err) { 
            console.log(err.message);
          });
        } 
      })
      .catch(function(err) {
        console.log(err.message);
      });
    });
  }
};
 
$(function() {
  $(window).load(function() {
    App.init();
  });
});


      