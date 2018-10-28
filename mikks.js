
var fs = require('fs');
var pbkdf2 = require('pbkdf2').pbkdf2Sync;
var unorm = require('unorm');
var randomBytes = require('randombytes')
var uniqueRandomRange = require('unique-random-range')
var xor = require('buffer-xor')

var address = require('./src/address');
var crypto = require('./src/crypto');
var ecpair = require('./src/ecpair');
var networks = require('./src/networks');
var hdnode = require('./src/hdnode');

var selectedWord = require('./src/wordlist/selectedWord.json');


// The user's sentence and password are kept.
function setPassword(personalSentence, password)
{
  return (personalSentence + ' ' + password);
}

// Match the selected word (shape, color, food, place, etc.) with the password.
function setSalt (randomByte, password)
{
  return (randomByte + ' ' + password);
}

//// Hang the selected word.
//function concatSeletedWord(selectedWord)
//{
//  let tmp = selectedWord[0];
//
//  for(i=1; i<selectedWord.length; i++)
//  {
//    tmp += (' ' + selectedWord[i]);
//  }
//  return tmp;
//}
//

// word of user, selected word, Generate Seed with your personal password.
function passphraseToSeed (personalSentence, personalPassword, randomByte)
{
  //let _rng = (randomByte || randomBytes(2));
  if(randomByte == null) {
    console.log(_randomNumber = uniqueRandomRange(0,65535)().toString(16))
    console.log(randomNumber = _randomNumber.length%2 != 0? '0'+_randomNumber : _randomNumber)
    var _rng = Buffer.from(randomNumber,'hex')
    console.log(_rng)
    // console.log(_rng.toString('hex') + ' : ' + parseInt(_rng.toString('hex'),16))
  } else _rng = randomByte;

  let sentenceBuffer = bufferModular(Buffer.from(unorm.nfkd(setPassword(personalSentence, personalPassword)), 'utf8'), _rng)
  let saltBuffer = bufferModular(Buffer.from(unorm.nfkd(setSalt(_rng, personalPassword)), 'utf8'), _rng)
  let _seed = pbkdf2(sentenceBuffer, saltBuffer, 2048, 64, 'sha512')
  return ({seed: _seed, rng: _rng})
}

function bufferModular(_testBuffer, _rng) {


  rng =  Buffer.allocUnsafe(2)
  _rng.copy(rng,0)

  testBuffer = _testBuffer;
  for(i=0; i<testBuffer.length; i++) {
    tempBuffer = (!i%2) ? rng.slice(0,1) : rng.slice(1,2);
    xor(testBuffer.slice(i,i+1), tempBuffer).copy(testBuffer, i);
    if (!i%2)
    testBuffer.slice(i,i+1).copy(rng,0);
    else
    testBuffer.slice(i,i+1).copy(rng,1);
  }
  //console.log(testBuffer);

  return testBuffer;
}

module.exports = {
  passphraseToSeed: passphraseToSeed,
  hdnode : hdnode,
  address : address,
  crypto : crypto,
  ecpair : ecpair,
  networks : networks,

  wordlist : selectedWord,

  // TODO: remove (just test.)
  setPassword : setPassword,
  setSalt : setSalt
}
