// import { HuffmanCoder } from './huffman.js';

class BinaryHeap {

	constructor() {
		this.heap = [];
	}

	insert(value) {
		this.heap.push(value);
		this.bubbleUp();
	}

	size() {
		return this.heap.length;
	}

	empty() {
		return (this.size() === 0);
	}

	//using iterative approach
	bubbleUp() {
		let index = this.size() - 1;

		while (index > 0) {
			let element = this.heap[index],
				parentIndex = Math.floor((index - 1) / 2),
				parent = this.heap[parentIndex];

			if (parent[0] <= element[0]) break;
			this.heap[index] = parent;
			this.heap[parentIndex] = element;
			index = parentIndex
		}
	}

	extractMin() {
		const max = this.heap[0];
		const tmp = this.heap.pop();
		if (!this.empty()) {
			this.heap[0] = tmp;
			this.sinkDown(0);
		}
		return max;
	}

	sinkDown(index) {

		let left = 2 * index + 1,
			right = 2 * index + 2,
			smallest = index;
		const length = this.size();

		// console.log(this.heap[left], left, length, this.heap[right], right, length, this.heap[largest]);

		if (left < length && this.heap[left][0] < this.heap[smallest][0]) {
			smallest = left
		}
		if (right < length && this.heap[right][0] < this.heap[smallest][0]) {
			smallest = right
		}
		// swap
		if (smallest !== index) {
			let tmp = this.heap[smallest];
			this.heap[smallest] = this.heap[index];
			this.heap[index] = tmp;
			this.sinkDown(smallest)
		}
	}
}

class HuffmanCoder {

	// \' is adding apostrophe before the characters which will help us to differentiate between code and character.Eg- when char is 1 or 0 
	//Encoding the huffman tree into a string or string representation of the tree
	stringify(node) {
		if (typeof (node[1]) === "string") {
			return '\'' + node[1];
		}

		return '0' + this.stringify(node[1][0]) + '1' + this.stringify(node[1][1]);
	}

	display(node, modify, index = 1) {
		if (modify) {
			node = ['', node];
			if (node[1].length === 1)
				node[1] = node[1][0];
		}

		if (typeof (node[1]) === "string") {
			return String(index) + " = " + node[1];
		}

		let left = this.display(node[1][0], modify, index * 2);
		let right = this.display(node[1][1], modify, index * 2 + 1);
		let res = String(index * 2) + " <= " + index + " => " + String(index * 2 + 1);
		return res + '\n' + left + '\n' + right;
	}

	//Getting the tree back from the data
	// destringify(data) {
	// 	let node = [];

	// 	//Handling leaf nodes, \' -> apostrophe
	// 	if (data[this.ind] === '\'') {
	// 		this.ind++;
	// 		node.push(data[this.ind]);
	// 		this.ind++;
	// 		return node;
	// 	}

	// 	//Handling internal nodes
	// 	this.ind++;
	// 	let left = this.destringify(data);
	// 	node.push(left);
	// 	this.ind++;
	// 	let right = this.destringify(data);
	// 	node.push(right);

	// 	return node;
	// }
	destringify(data) {
		let node = [];
	
		//Handling leaf nodes, \' -> apostrophe
		if (data[this.ind] === '\'') {
			this.ind++;
			node.push(data[this.ind]);
			this.ind++;
			return node;
		}
	
		//Handling internal nodes
		if (this.ind >= data.length) { // Exit condition added
			return null;
		}
		
		this.ind++;
		let left = this.destringify(data);
		node.push(left);
	
		if (this.ind >= data.length) { // Exit condition added
			return null;
		}
	
		this.ind++;
		let right = this.destringify(data);
		node.push(right);
	
		return node;
	}
	  

	//Leaf nodes have structure of (Frequency , character) so in case of leaf node the 2nd elemnt will be of type string 
	//Internal nodes have structure of (Frequency ,{left child,right child}) so here 2nd element is of type object
	//Path is the current code
	getMappings(node, path) {
		if (typeof (node[1]) === "string") {
			this.mappings[node[1]] = path;
			return;
		}
		this.getMappings(node[1][0], path + "0");
		this.getMappings(node[1][1], path + "1");
	}

	encode(data) {
		//Getting the Min heap
		this.heap = new BinaryHeap();

		//Storing the frequency count 
		const mp = new Map();
		for (let i = 0; i < data.length; i++) {
			if (data[i] in mp) {
				mp[data[i]] = mp[data[i]] + 1;
			} else {
				mp[data[i]] = 1;
			}
		}

		//Inserting the element in the Heap in the form {frequency , character}
		for (const key in mp) {
			this.heap.insert([mp[key], key]);
		}

		//Creating the Huffman Tree
		while (this.heap.size() > 1) {
			const node1 = this.heap.extractMin();
			const node2 = this.heap.extractMin();

			const node = [node1[0] + node2[0], [node1, node2]];//Frequency,(left child,right child)
			this.heap.insert(node);
		}

		//Extracting the Huffman Tree
		const huffman_encoder = this.heap.extractMin();


		// {} is used to create an empty object
		//Mapping will help in getting the char -> binary code
		this.mappings = {};
		this.getMappings(huffman_encoder, "");


		//Mapping character string to binary string
		let binary_string = ""; //binary string will store the encoded binary string
		for (let i = 0; i < data.length; i++) {
			binary_string = binary_string + this.mappings[data[i]];
		}


		//For storing the encoded binary string we need to break it into multiples of 8 and map to an ASCII character 
		// Padding binary string to make length multiple of 8 
		let rem = (8 - binary_string.length % 8) % 8;//Rem stores the extra 0s added to make multiple of 8
		let padding = "";
		for (let i = 0; i < rem; i++)
			padding = padding + "0";
		binary_string = binary_string + padding;


		//Binary String to corresponding character array
		let result = "";
		for (let i = 0; i < binary_string.length; i += 8) {
			let num = 0;
			for (let j = 0; j < 8; j++) {
				num = num * 2 + (binary_string[i + j] - "0");
			}
			result = result + String.fromCharCode(num);
		}


		//Final_res is a string that contain the string representation of tree + remainder + encoded text 
		let final_res = this.stringify(huffman_encoder) + '\n' + rem + '\n' + result;
		let info = "Compression Ratio : " + data.length / final_res.length;
		info = "Compression & Encoding completed, file sent for download" + '\n' + info;
		// return [final_res, this.display(huffman_encoder, false), info];
		return [final_res, info];
	}

	decode(data) {
		//Splitting the string into tree + remainder + encoded text 
		data = data.split('\n');
		if (data.length === 4) {
			// Handling new line case
			data[0] = data[0] + '\n' + data[1];
			data[1] = data[2];
			data[2] = data[3];
			data.pop();
		}

		this.ind = 0;
		const huffman_decoder = this.destringify(data[0]);
		const text = data[2];

		// After retrieving the huffman tree we need to retrieve the binary string 
		let binary_string = "";
		for (let i = 0; i < text.length; i++) {
			let num = text[i].charCodeAt(0);
			let bin = "";
			for (let j = 0; j < 8; j++) {
				bin = num % 2 + bin;
				num = Math.floor(num / 2);
			}
			binary_string = binary_string + bin;
		}

		//Removing the extra padding , data[1] stores the padded variable ie: Remainder
		binary_string = binary_string.substring(0, binary_string.length - data[1]);

		console.log(binary_string.length);

		//Converting binary string to original text using huffman tree
		let res = "";
		let node = huffman_decoder; //Initialized to root
		for (let i = 0; i < binary_string.length; i++) {
			if (binary_string[i] === '0') {
				node = node[0]; //left
			} else {
				node = node[1]; //right
			}


			//If Leaf node then we add the character to result 
			if (typeof (node[0]) === "string") {
				res += node[0];
				node = huffman_decoder;
			}
		}
		let info = "Decompression & De-coding completed, file sent for download\n";
		// return [res, this.display(huffman_decoder, true), info];
		return [res, info];
	}
}


window.onload = function () {
	console.log("here onload");

	decodeBtn = document.getElementById("decode");
	encodeBtn = document.getElementById("encode");
	fileForm = document.getElementById("fileform");
	uploadFile = document.getElementById("uploadfile")
	submitBtn = document.getElementById("submitbtn");
	step1 = document.getElementById("step1");
	step2 = document.getElementById("step2");
	step3 = document.getElementById("step3");

	isSubmitted = false;
	codecObj = new HuffmanCoder();
	// const coder = new HuffmanCoder();

	// upload.addEventListener('change',()=>{ alert("File uploaded") });
	// called when upload button is clicked
	submitBtn.onclick = function () {
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
			return;
		}
		let nameSplit = uploadedFile.name.split('.');
		var extension = nameSplit[nameSplit.length - 1].toLowerCase();
		if (extension != "txt") {
			alert("Invalid file type (." + extension + ") \nPlease upload a valid .txt file and try again!");
			return;
		}
		alert("File submitted !!");
		isSubmitted = true;
		onclickChanges("Done!! File uploaded !", step1);
	}

	// called when compress button is clicked
	encodeBtn.onclick = function () {
		console.log("encode onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a file and try again!");
			return;
		}
		if (isSubmitted === false) {
			alert("File not submitted.\nPlease click the upload button on the previous step\nto upload the file and try again!");
			return;
		}
		console.log(uploadedFile.size);
		if (uploadedFile.size === 0) {
			alert("WARNING: You have uploaded an empty file!\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
		}
		else if (uploadedFile.size <= 350) {
			alert("WARNING: The uploaded file is very small in size (" + uploadedFile.size + " bytes) !\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
		}
		else if (uploadedFile.size < 1000) {
			alert("WARNING: The uploaded file is small in size (" + uploadedFile.size + " bytes) !\nThe compressed file's size might be larger than expected (compression ratio might be small).\nBetter compression ratios are achieved for larger file sizes!");
		}
		onclickChanges("Done!! Your file will be Encoded", step2);
		onclickChanges2("Encoding your file ...", "Encoded");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [encodedString, info] = codecObj.encode(text);
			myDownloadFile(uploadedFile.name.split('.')[0] + "_encoded.txt", encodedString);
			ondownloadChanges(info);
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
	}

	// called when decompress button is clicked
	decodeBtn.onclick = function () {
		console.log("decode onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a file and try again!");
			return;
		}
		if (isSubmitted === false) {
			alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
			return;
		}
		onclickChanges("Done!! Your file will be De-coded", step2);
		onclickChanges2("De-coding your file ...", "De-coded");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [decodedString, info] = codecObj.decode(text);
			myDownloadFile(uploadedFile.name.split('.')[0] + '_decoded.txt', decodedString);
			ondownloadChanges(info);
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
	}
};

// function downloadFile(fileName, data) {
//     let a = document.createElement('a');
//     a.href = "data:application/octet-stream," + encodeURIComponent(data);
//     a.download = fileName;
//     a.click();
// }
function onclickChanges(firstMsg, step) {
	step.innerHTML = "";
	let img = document.createElement("img");
	img.src = "assets/done.png";
	img.id = "doneImg";
	step.appendChild(img);
	var br = document.createElement("br");
	step.appendChild(br);
	let msg = document.createElement("span");
	msg.className = "text2";
	msg.innerHTML = firstMsg;
	step.appendChild(msg);
}

// changes dom when step 2 is complete (step 3 is running)
function onclickChanges2(secMsg, word) {
	decodeBtn.disabled = true;
	encodeBtn.disabled = true;
	step3.innerHTML = "";
	let msg2 = document.createElement("span");
	msg2.className = "text2";
	msg2.innerHTML = secMsg;
	step3.appendChild(msg2);
	// var br = document.createElement("br");
	// step3.appendChild(br);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = " , " + word + " file will be downloaded automatically!";
	step3.appendChild(msg3);
}

/// function to download file
function myDownloadFile(fileName, text) {
	let a = document.createElement('a');
	a.href = "data:application/octet-stream," + encodeURIComponent(text);
	a.download = fileName;
	a.click();
}

// changed dom when file is downloaded (step 3 complete)
function ondownloadChanges(outputMsg) {
	step3.innerHTML = "";
	let img = document.createElement("img");
	img.src = "assets/done.png";
	img.id = "doneImg";
	step3.appendChild(img);
	var br = document.createElement("br");
	step3.appendChild(br);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = outputMsg;
	step3.appendChild(msg3);
}

$("form").on("change", ".file-upload-field", function () {
	$(this).parent(".file-upload-wrapper").attr("data-text", $(this).val().replace(/.*(\/|\\)/, ''));
});