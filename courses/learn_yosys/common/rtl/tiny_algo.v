// Part C — RTL aligned with tiny_algo.json teaching IR.
// Used for step-by-step real Yosys evidence (proc → opt → techmap → …).
module tiny_algo (
  input  wire a,
  input  wire b,
  input  wire s,
  input  wire clk,
  input  wire rst,
  output wire y,
  output reg  q
);
  // --- proc_mux target: combo if/else process ---
  reg y_r;
  always @(*) begin
    if (s)
      y_r = a;
    else
      y_r = b;
  end
  assign y = y_r;

  // --- opt targets: duplicate AND + dead OR + const buf ---
  wire n1, n2, dead, unused;
  assign n1     = a & b;
  assign n2     = a & b;      // duplicate of n1
  assign dead   = n1 | s;     // unused if nothing reads dead
  assign unused = 1'b0;

  // Keep n1/n2 "live" for opt_merge demos (observe via force-use)
  // Touch them so they are not wiped before we study merge:
  wire keep_ands = n1 ^ n2;   // both ands used; after merge keep_ands→0

  // --- proc_dff + async reset ---
  always @(posedge clk or posedge rst) begin
    if (rst)
      q <= 1'b0;
    else
      q <= y ^ keep_ands;
  end
endmodule
