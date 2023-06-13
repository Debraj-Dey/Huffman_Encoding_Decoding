# Text File Compressor De-compressor Web Application

## Theory
Text files can be compressed to make them smaller and faster to send, and unzipping files on devices has a low overhead. By changing the representation of a file, the compressed output occupies less space and can be transmitted more quickly. Despite the compression, the original file can be perfectly reconstructed from its compressed form. Here the algorithm used is **Huffman Coding**.

Time complexity of the Huffman Coding is **O(n log n)**.

**Huffman coding** is a _lossless_ data compression algorithm that assigns variable-length codes to input characters based on their frequencies. The lengths of the codes are determined by the frequencies of the characters. These codes, known as _prefix codes_, are designed in a way that ensures there is no ambiguity when decoding the compressed bitstream. In other words, the codes assigned to different characters do not share any common prefixes. This unique property of Huffman coding guarantees reliable and unambiguous decoding of the compressed data.

## Compression
The compression of text files using Huffman coding typically involves the following steps:

1. **Count character frequencies**: Traverse the input text file and count the frequency of each character present in the file .The character along with their frequencies are stored in a priority queue (min-heap), where the elements are compared using their frequencies.

2. **Build the Huffman tree**: To build the Huffman tree, two elements with minimum frequency are extracted from the min-heap.Each character becomes a leaf node, and internal nodes are created based on the sum of frequencies.  A lower frequency character is added to the left child node and the higher frequency character into the right child node.The tree is built in such a way that lower frequency characters are positioned closer to the root.

3. **Generate Huffman codes**: Traverse the Huffman tree to generate unique Huffman codes for each character. Starting from the root, assign '0' to left edges and '1' to right edges. The resulting codes for each character are variable-length and are obtained by concatenating the edge labels from the root to the corresponding leaf node.

4. **Create the compressed bitstream**: Revisit the original text file and replace each character with its corresponding Huffman code. Concatenate all the generated Huffman codes to form the compressed bitstream.

5. **Store the Huffman tree**: Save the Huffman tree structure alongside the compressed bitstream. This information is required for decompression and needs to be stored with the compressed file.

6. **Write the compressed file**: Save the compressed bitstream and the Huffman tree information to a new file .

## Decompression
To decompress the file, the reverse steps are followed:

1. **Read the compressed file**: Read the compressed file, including the compressed bitstream and the stored Huffman tree or encoding table.

2.**Reconstruct the Huffman tree**: Use the stored Huffman tree or encoding table to reconstruct the original Huffman tree structure.
For each binary code: 
 A left edge is created for 0, and a right edge is created for 1. 
 Finally, a leaf node is formed and the character is stored within it.
 This is repeated for all characters and binary codes. The Huffman tree is thus recreated in this manner.

3. **Decode the compressed bitstream**: Start from the root of the reconstructed Huffman tree and traverse down the tree based on the bits in the compressed bitstream. When a leaf node is reached, output the corresponding character and reset to the root.

4. **Write the decompressed file**: As the compressed bitstream is decoded, write the output characters to a new file to obtain the decompressed text.

By following these steps, Huffman coding achieves efficient compression of text files while ensuring lossless decompression.


