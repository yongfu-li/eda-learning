module tiny_combo (
  input  a,
  input  b,
  output y
);
  wire n1, n2;
  AND2 u1 (.A(a), .B(b), .Y(n1));
  BUF  u2 (.A(n1), .Y(n2));
  INV  u3 (.A(n2), .Y(y));
endmodule
