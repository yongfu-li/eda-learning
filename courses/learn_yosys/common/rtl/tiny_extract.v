// Part C — extract evidence: AND feeding OR matches ANDOR2 pattern.
module tiny_extract (
  input  wire a,
  input  wire b,
  input  wire c,
  output wire o
);
  wire t;
  assign t = a & b;
  assign o = t | c;
endmodule
