// Fixed ids in the same shape as real ones, so the real forms and schemas
// accept them. The last block says what each one is.
function id(kind: number, n: number) {
  const tail = `${kind.toString(16)}${n.toString(16).padStart(3, '0')}`;
  return `de000000-0000-4000-8000-00000000${tail}`;
}

export const ID = {
  teacher: id(1, 1),
  student: (n: number) => id(2, n),
  class: (n: number) => id(3, n),
  enrollment: (n: number) => id(4, n),
  homework: (n: number) => id(5, n),
  note: (n: number) => id(6, n),
  material: (n: number) => id(7, n),
  quiz: id(8, 1),
  question: (n: number) => id(9, n),
  option: (q: number, o: number) => id(10, q * 10 + o),
};
