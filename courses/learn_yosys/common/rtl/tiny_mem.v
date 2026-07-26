// Part C — memory evidence (width=4, depth=8) aligned with tiny_algo.json memory.
module tiny_mem (
  input  wire       clk,
  input  wire       we,
  input  wire [2:0] waddr,
  input  wire [3:0] wdata,
  input  wire [2:0] raddr,
  output reg  [3:0] rdata
);
  reg [3:0] mem [0:7];
  always @(posedge clk) begin
    if (we)
      mem[waddr] <= wdata;
    rdata <= mem[raddr];
  end
endmodule
