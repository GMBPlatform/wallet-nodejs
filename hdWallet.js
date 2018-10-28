// main file, entry hdWalletlication

var express = require('express');
var hdWallet = express();
var bodyParser = require('body-parser');
var mikks = require('./')
var jade = require('jade');

createHash = require('create-hash');
bs58check = require('bs58check');

hdWallet.locals.pretty = true;
hdWallet.set('view engine', 'jade');
hdWallet.set('views', './views');
hdWallet.use(express.static('public'));
hdWallet.use(bodyParser.urlencoded({extended : false}))

hdWallet.get('/', function(req, res){
  res.render('main');
})
hdWallet.get('/generate_wallet', function(req, res){
  res.render('walletGen');
});
hdWallet.get('/search_wallet', function(req, res){
  res.render('walletCheck');
});

hdWallet.get('/childKey_derivation', function(req, res){
  res.render('keyDerivation');
});

hdWallet.post('/walletInfo', function(req, res){
  let personalSentence = req.body.personalSentence;
  let personalPassword = req.body.personalPassword;

  console.log(req.body.randomNumber);
  if(req.body.randomNumber) {
    randomNumber = parseInt(req.body.randomNumber).toString(16);
    randomByte = Buffer.from((randomNumber.length%2 != 0) ? '0'+randomNumber : randomNumber,'hex');
  }
  else randomByte = req.body.randomNumber;
  let seed = mikks.passphraseToSeed(personalSentence, personalPassword, randomByte);
  let masterNode = mikks.hdnode.fromSeedBuffer(seed.seed);

  rng = parseInt(seed.rng.toString('hex'),16);
  //프라이빗키 masterNode.keyPair.d.toString(16)
  //체인코드 masterNode.getPublicKeyBuffer().toString('hex')
  //퍼블릭키 masterNode.chainCode.toString('hex')
  //확장 개인키 masterNode.toBase58()
  //확장 공개키 masterNode.neutered().toBase58()
  //bip44 경로
  childNode = masterNode.derivePath("m/44'/0'/0'/0");

  var strCKD = "";
  strCKD +=  "<table border=1 style='font-size:13.2px; margin: 0 auto;'>";
  strCKD +=  "<tr> <th>Path</th> <th>Address</th> <th>Public Key</th> <th>Private Key</th> </tr>"
  for(var i=0 ; i<=50; i++) {
    pvk = childNode.derive(i).keyPair.d.toString(16);
    pvk = pvk.length == 63 ? '0'+pvk: pvk;
    path = "m/44'/0'/0'/0/"+i;
    strCKD +=  "<div id='tete'></div> <tr>";
    strCKD +=  "<td> "+ path + "</td>";
    temp=  `<td onmouseover=mover('${childNode.derive(i).getAddress()}') onmouseout='mout()'> ${childNode.derive(i).getAddress()}</td>`;
    strCKD += temp;
    strCKD +=  "<td>" + childNode.derive(i).getPublicKeyBuffer().toString('hex') + "</td>";
    strCKD +=  "<td>" + pvk + "</td>";
    strCKD +=  "</tr>";
    console.log(path)
  }
  strCKD +=  "</table>";

  output = `
  <!DOCTYPE>
  <html>
  <head>
    <meta charset='utf8'>
    <title> 지갑 정보 </title>
    <style>
    #tete
    {
      position:fixed; top: 0px; right:0px;
    }
    </style>
  </head>
  <body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
    <script type="text/javascript" src="web/jquery.qrcode.min.js"></script>
    <script type="text/javascript" src="web/jquery.qrcode.js"></script>
    <script type="text/javascript" src="web/qrcode.js"></script>

    <div class="walletInfo" style="text-align:center; width:1400px; margin:0 auto;">

      <fieldset style="float:right; width:40%;">
        <legend>
          <h1> QR Code </h1>
        </legend>

        <div id="extendedPrivateKey" style="margin-left:25%; margin-right:25%">
          <div id="chk"><a href="http://mofas.io/" target="_blank"><img src="test.jpg" width="257" height="50" style="position: relative; top: 155px; right: 12px;"></a></div>
        </div>
        <p><h1>ExtendedPrivateKey</h1></p>

        <div id="masterAddress" style="margin-left:25%; margin-right:25%">
          <div id="chk"><a href="http://mofas.io/" target="_blank"><img src="test.jpg" width="257" height="0" style="position: relative; top: 155px; right: 12px;"></a></div>
        </div>
        <p><h1>MasterNode Address</h1></p>
      </fieldset>

      <fieldset style="float:left; width:40%;">
        <legend>
          <h1> 지갑 정보 </h1>
        </legend>
        <p><h1>RandomNumber(*)</h1><textarea id="rng" readonly="readonly" style="background-color:#8fd5ff; width: 700px; height: 50px border:1; overflow:visible; text-overflow:ellipsis">${rng}</textarea></p>
        <p><h1>PrivateKey</h1><textarea id="privateKey" readonly="readonly" style="background-color:#eeeeee; width: 700px; height: 50px border:1; overflow:visible; text-overflow:ellipsis">${masterNode.keyPair.d.toString(16)}</textarea></p>
        <p><h1>ChainCode</h1><textarea id="chainCode" readonly="readonly" style="background-color:#eeeeee; width: 700px; height: 50px border:1; overflow:visible; text-overflow:ellipsis">${masterNode.getPublicKeyBuffer().toString('hex')}</textarea></p>
        <p><h1>PublicKey</h1><textarea id="publicKey" readonly="readonly" style="background-color:#eeeeee; width: 700px; height: 50px border:1; overflow:visible; text-overflow:ellipsis">${masterNode.chainCode.toString('hex')}</textarea></p>
        <p><h1>Extended PrivateKey</h1><textarea id="extendedPrivateKey" readonly="readonly" style="background-color:#eeeeee; width: 700px; height: 50px border:1; overflow:visible; text-overflow:ellipsis">${masterNode.toBase58()}</textarea></p>
        <p><h1>Extended PublicKey</h1><textarea id="extendedPublicKey" readonly="readonly" style="background-color:#eeeeee; width: 700px; height: 50px border:1; overflow:visible; text-overflow:ellipsis">${masterNode.neutered().toBase58()}</textarea></p>
        <br></fieldset>
      </div>


      <div class="walletInfo2" style="width: 1400px; margin: 0 auto; text-align:center;" >
        <fieldset style="width: 100%">
          <legend>
            <h1> 파생된 키 </h1>
          </legend>
                <div id="mikks_CKD"></div>
        </fieldset>
      </div>

      <script type="text/javascript">
      function testInnerHTML()
      {
        var str = "${strCKD}"
        document.getElementById("mikks_CKD").innerHTML = str;
      }
      testInnerHTML();

      jQuery('#extendedPrivateKey').qrcode({
        render: "table",
        text: "${masterNode.toBase58()}"
      });

      jQuery('#masterAddress').qrcode({
        render: "table",
        text: "${masterNode.getAddress()}"
      });

      function mover(index) {
        //alert(index);
        temp = '${masterNode.derive(0).getAddress()}'
        jQuery('#tete').qrcode(index);
      }
      function mout() {
        $("#tete").empty()
      }
      </script>
      </body>
      </html>
`;

  res.send(output);
});

hdWallet.listen(1337, function(){
  console.log('Connected 1337 port!');
});
