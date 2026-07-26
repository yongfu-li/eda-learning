# 02 — SDC clocks + I/O delays
read_liberty lib/tiny_opensta_lib.lib
read_verilog rtl/tiny_combo.v
link_design tiny_combo
create_clock -name clk -period 10
set_input_delay -clock clk 0 [all_inputs]
set_output_delay -clock clk 0 [all_outputs]
puts "CLOCKS=[get_full_name [get_clocks *]]"
puts "PERIOD=10"
puts "SDC_OK"
