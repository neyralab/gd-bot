class NumberEncoder {
  constructor() {}

  // Encode numbers into a byte array
  encodeNumbers(input, lengths) {
    const parts = input.split(";");
    if (parts.length !== lengths.length) {
      throw new Error(`Expected ${lengths.length} numbers, got ${parts.length}`);
    }

    // Calculate total buffer size
    let totalSize = lengths.reduce((a, b) => a + b, 0);
    let buf = new Uint8Array(totalSize);

    // Encode numbers
    let offset = 0;
    for (let i = 0; i < parts.length; i++) {
      let num = BigInt(parts[i]);
      for (let j = 0; j < lengths[i]; j++) {
        buf[offset + j] = Number((num >> BigInt(8 * (lengths[i] - 1 - j))) & BigInt(0xff));
      }
      offset += lengths[i];
    }

    return buf;
  }

  // Encode byte array to Base64
  encodeToBase64(buf) {
    return btoa(String.fromCharCode.apply(null, buf));
  }
}

export { NumberEncoder }