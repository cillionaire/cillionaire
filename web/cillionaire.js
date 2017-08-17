var KOVAN = {"endpoint":"https://kovan.infura.io/", "address":"0x13171fF9F5De1904509F08cdc3b7Ae2087931e43", "units":"Kovan Test ETH", "etherscanURL":"https://kovan.etherscan.io/address/"};
var MAIN_INFURA = {"endpoint":"https://mainnet.infura.io/", "address":"0x4f6Fe3bBEfDB17E23D6e74a33482413c961569C3", "units":"ETH", "etherscanURL":"https://etherscan.io/address/"};
var MAIN_MYETHERAPI = {"endpoint":"https://api.myetherapi.com/eth", "address":"0x4f6Fe3bBEfDB17E23D6e74a33482413c961569C3", "units":"ETH", "etherscanURL":"https://etherscan.io/address/"};
var ABI  = [{"constant":false,"inputs":[{"name":"_ownerRandomHash","type":"bytes32"}],"name":"start","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_count","type":"uint256"}],"name":"refund","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ownerRandomHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participants","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"stake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdrawFees","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"pot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_potTarget","type":"uint256"},{"name":"_stake","type":"uint256"},{"name":"_fee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ownerRandomNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ownerRandomNumber","type":"string"},{"name":"_ownerRandomSecret","type":"string"}],"name":"chooseWinner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastRefundedIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"potTarget","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minerRandomNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fees","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setContractOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"participate","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"funds","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"participationEndTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newState","type":"uint8"}],"name":"StateChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"},{"indexed":false,"name":"total","type":"uint256"},{"indexed":false,"name":"stakeAfterFee","type":"uint256"},{"indexed":false,"name":"refundNow","type":"uint256"}],"name":"NewParticipant","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"}],"name":"MinerRandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"}],"name":"OwnerRandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"randomNumber","type":"uint256"}],"name":"RandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winnerIndex","type":"uint256"}],"name":"WinnerIndex","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_winner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Winner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Refund","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cancelledBy","type":"address"}],"name":"Cancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newPotTarget","type":"uint256"},{"indexed":false,"name":"newStake","type":"uint256"},{"indexed":false,"name":"newFee","type":"uint256"}],"name":"ParametersChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"ContractOwnershipTransferred","type":"event"}];

var network = null;
var Web3 = require('web3');
var web3 = null;
var Cillionaire = null;
var cillionaire = null;

$(function () {
	setNetwork(MAIN_MYETHERAPI);
	initUI();
});

async function setNetwork(_network) {
	$("#loading").css("display", "block");
	$("#contractError").css("display", "none");
	clearContractUI();
	network = _network;
	web3 = new Web3(new Web3.providers.HttpProvider(network.endpoint));
	Cillionaire = web3.eth.contract(ABI);
	cillionaire = Cillionaire.at(network.address);
	await sleep(2000);
	try {
		updateContractUI();
	} catch (err) {
		console.log(err);
		clearContractUI();
		$("#contractError").html(err.message.replace(/(\r\n|\n|\r|\\r|\\n)/gm, "")+"<br>");
		$("#contractError").css("display", "block");
	}
	$("#loading").css("display", "none");
}

function initUI() {
	$("#network").change(onChangeNetwork);
	$("#btnParticipate").click(onClickParticipate);
	$("#btnWithdraw").click(onClickWithdraw);
	$("#btnRefund").click(onClickRefund);
}

function onChangeNetwork() {
	var n = $("#network").val();
	if (n=="Mainnet (MyEtherApi)") {
		setNetwork(MAIN_MYETHERAPI);
	} else if (n=="Mainnet (Infura)") {
		setNetwork(MAIN_INFURA);
	} else if (n=="Kovan Testnet (Infura)"){
		setNetwork(KOVAN);
	}
}

function onClickParticipate() {
	launchMyEtherWalletTransaction(network.address, cillionaire.stake(), cillionaire.participate.getData());
}

function onClickWithdraw() {
	alert("withdraw");
}

function onClickRefund() {
	alert("refund");
}

function clearContractUI() {
	$("#contractAddress").html("");
	$('#contractState').html("");
	$('#contractPotTarget').html("");
	$('#contractStake').html("");
	$('#contractFee').html("");
	$('#contractPot').html("");
	$('#contractParticipants').html("");
	$('#contractWinner').html("");
	showActions(-1);
}

function updateContractUI() {
	$("#contractAddress").html(etherscanLink(network.address));
	initState();
	$('#contractPotTarget').html(formatEth(cillionaire.potTarget()));
	$('#contractStake').html(formatEth(cillionaire.stake()));
	$('#contractFee').html(formatEth(cillionaire.fee()) + " (The fee is taken from each participant's stake)");
	$('#contractPot').html(formatEth(cillionaire.pot()));
	initParticipants();
	$('#contractWinner').html(formatWinner(cillionaire.winner()));
}

function initState() {
	var state = parseInt(cillionaire.state());
	var stateString = "Unknown";
	switch (state) {
		case 0: stateString = "ENDED - The game is not currently ongoing. The stats below reflect the last game."; break;
		case 1: stateString = "PARTICIPATION - Participate by sending the required amount of ether (stake) to the contract using the <i>participate()</i> function."; break;
		case 2: stateString = "CHOOSE WINNER - Participation phase is complete. Next step is to draw the winner."; break; 
		case 3: stateString = "REFUND - The game was cancelled. Now, all participants must be refunded, before a new game can start."; break;
	}
	$('#contractState').html(stateString);
	showActions(state);
}

function showActions(state) {
	$("#btnParticipate").css("display", state==1 ? "block" : "none");
	$("#btnWithdraw").css("display", state==0 ? "block" : "none");
	$("#btnRefund").css("display", state==3 ? "block" : "none");
}


function initParticipants() {
	var i = 0;
	while (cillionaire.participants(i).toString() != "0x") {
		i++;
	}
	$('#contractParticipants').html(i);
}

function formatEth(wei) {
	return wei.dividedBy(1E18).toString() + ' ' + network.units;
}

function formatWinner(winner) {
	return winner.toString() == "0x0000000000000000000000000000000000000000" ? "Not yet decided" : winner.toString();
}

function etherscanLink(address) {
	return '<a href="'+network.etherscanURL+address+'">'+address+'</a>';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function launchMyEtherWalletTransaction(to, valueWei, data) {
	$("#actionsError").css("display", "none");
	var gasLimit = web3.eth.estimateGas({
	    "to": to, 
	    "data": data,
		"value": valueWei
	}) * 2;
	var url = "https://www.myetherwallet.com/?to="+to+"&value="+valueWei.dividedBy(1E18).toString()+"&data="+data+"&gaslimit="+gasLimit.toString()+"#send-transaction"
	var win = window.open(url, '_blank');
	if (win) {
	    win.focus();
	} else {
		$("#actionsError").html("Your browser blocks popups. Please visit MyEtherWallet through the following link:<br><a href='"+url+"'>"+url+"</a>");
	    $("#actionsError").css("display", "block");
	}
}
