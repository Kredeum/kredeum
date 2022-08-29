function* tx(): Generator<number> {
  let count = 1;
  console.log("premier passage", count);
  yield count;

  count++;
  console.log("second passage", count);
  yield count;
}

const oneTtx = tx();

let more;
while (!(more = oneTtx.next()).done) console.log(more.value);
