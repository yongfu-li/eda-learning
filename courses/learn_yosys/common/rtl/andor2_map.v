// Pattern module for Yosys extract (AND→OR → ANDOR2).
module ANDOR2 (X, Y, Z, O);
  input X, Y, Z;
  output O;
  assign O = (X & Y) | Z;
endmodule
