# 03 — report_checks (max path)
read_liberty lib/tiny_opensta_lib.lib
read_verilog rtl/tiny_combo.v
link_design tiny_combo
create_clock -name clk -period 10
set_input_delay -clock clk 0 [all_inputs]
set_output_delay -clock clk 0 [all_outputs]
report_checks -path_delay max -fields {slew capacitance input_pin} -digits 3
report_checks -path_delay max -format end -digits 3
