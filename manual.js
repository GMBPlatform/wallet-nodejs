
mikks = require('./');

//////////////////////////////////////////////////////
// part1. 선택한 문장, 단어, 비밀번호를 통해 Seed 생성 //
//////////////////////////////////////////////////////

test = {};

test.input = {};
test.input.personalSentence = (personalSentence = "I am a good boy.");
test.input.selectedWord = selectedWord = ["타원", "Red", "떡볶이", "신당동"];
test.input.personalPassword = personalPassword = "얼쑤 ~! Momikks. 에헤라디야 흥해라";

test.output = {};
test.output.Password = mikks.setPassword(personalSentence, personalPassword);
test.output.Salt = mikks.setSalt(selectedWord, personalPassword);


test.output.seed = seed = mikks.passphraseToSeed(personalSentence, selectedWord, personalPassword).toString('hex');

///////////////////////////////////////////
// part2. 생성한 seed로 MasterNode를 생성 //
///////////////////////////////////////////

test.masterNode = masterNode = mikks.hdnode.fromSeedHex(seed);
// masterNode = mikks.hdnode.fromSeedHex(seed, mikks.network.bitcoin)
// 기본적으로 network를 bitcoin으로 잡으며, 둘은 같다.

/*
HDNode {
keyPair:
ECPair {
d:
BigInteger {
'0': 18208376,
'1': 53836899,
'2': 29316350,
'3': 6439696,
'4': 45957319,
'5': 3860859,
'6': 58191141,
'7': 62409655,
'8': 53162594,
'9': 3212846,
'10': 0,
t: 10,
s: 0 },
compressed: true,
network: { bip32: [Object], wif: 128 } },
chainCode: <Buffer 11 c6 c0 8c 5a 46 e4 11 b5 54 4c f4 79 35 68 ea 53 d6 52 3f a3 44 4b 9d 7c 8d ca 0f 98 88 45 0d>,
depth: 0,
index: 0,
parentFingerprint: 0 }
*/

test.자세하게 = {};

// privateKey
test.자세하게.privateKey = masterNode.keyPair.d.toString(16);

// publicKey
test.자세하게.publicKey = masterNode.getPublicKeyBuffer().toString('hex');

// chainCode
test.자세하게.chainCode = masterNode.chainCode.toString('hex');

// 확장 privateKey, 확장 publicKey
test.자세하게.extendedPrivateKey = masterNode.toBase58()
// 'xprv9s21ZrQH143K2Ed3As1Ytq8EhXgVZ3Ctz4wYTWTNwgb4TrNJsMqXoUQJxVa1HRfSAXdKbNDMZfs44Ffz6iASmReqvn9y9wG15JTAMce5LbU'

test.자세하게.extendedPublicKey = masterNode.neutered().toBase58()
// 'xpub661MyMwAqRbcEihWGtYZFy4yFZWyxVvkMHs9FtrzW283LehTQu9nMGinonoMqfgZ3WD9B3QECdzhXkxoPUaeMSY7rFf7UNZyvAVDhSFxC8j'

///////////////////////////////////////////
// part3. masterNode에서 child키 파생하기 //
///////////////////////////////////////////

// masternode -> child 키 파생하기
masterNode.derive(0);
masterNode.neutered().derive(0);
masterNode.deriveHardened(0);
masterNode.derivePath("0'/0'/0'/0/0");

// child -> child 키 파생하기
child = masterNode.derive(0);
child.deriveHardened(0);
child.derive(0);

//////////////////////////////////////////
// part4. PublicKey로 지갑 주소 생성하기 //
//////////////////////////////////////////

test.자세하게.walletAddress = masterNode.getAddress();
child.getAddress();

console.log(test);
