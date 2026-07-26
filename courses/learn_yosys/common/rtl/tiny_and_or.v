// Tiny hierarchical RTL for learn_yosys real-CLI evidence.
// Mirrors the literacy toy: AND, OR, duplicate AND, dead const, NOT, child DFF.
module child (
  input  wire clk,
  input  wire d,
  output reg  q
);
  always @(posedge clk)
    q <= d;
endmodule

module top (
  input  wire a,
  input  wire b,
  input  wire c,
  input  wire clk,
  output wire q
);
  wire n1, n2, n3, dead, out;

  assign n1   = a & b;
  assign n2   = n1 | c;
  assign n3   = a & b;   // duplicate of n1 (opt/strash target)
  assign dead = 1'b0;    // dead constant (opt target)
  assign out  = ~n2;

  child u_child (
    .clk(clk),
    .d(out),
    .q(q)
  );
endmodule
