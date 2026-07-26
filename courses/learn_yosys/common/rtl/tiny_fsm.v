// Part C — FSM evidence (IDLE/RUN/DONE). State is internal so fsm_detect can mark it.
module tiny_fsm (
  input  wire clk,
  input  wire rst,
  input  wire s,
  input  wire a,
  output wire idle,
  output wire run,
  output wire done
);
  localparam IDLE = 2'b00;
  localparam RUN  = 2'b01;
  localparam DONE = 2'b10;

  reg [1:0] state;
  always @(posedge clk or posedge rst) begin
    if (rst)
      state <= IDLE;
    else begin
      case (state)
        IDLE: state <= s ? RUN : IDLE;
        RUN:  state <= a ? DONE : RUN;
        DONE: state <= IDLE;
        default: state <= IDLE;
      endcase
    end
  end
  assign idle = (state == IDLE);
  assign run  = (state == RUN);
  assign done = (state == DONE);
endmodule
