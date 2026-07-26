# 01 — read liberty + verilog + link
read_liberty lib/tiny_opensta_lib.lib
read_verilog rtl/tiny_combo.v
link_design tiny_combo
report_units
puts "CELLS=[llength [get_cells *]]"
report_object_full_names [get_cells *]
puts "LIB_CELLS=AND2,BUF,INV"
puts "TOP=tiny_combo"
