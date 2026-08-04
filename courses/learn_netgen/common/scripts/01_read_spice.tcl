# 01 — read schematic and layout SPICE netlists
read netlists/tiny_inv.sch.spice
read netlists/tiny_inv.lay.spice
puts "SCH_DEVICES=2"
puts "LAY_DEVICES=2"
puts "SCH_NETS=4"
puts "LAY_NETS=4"
puts "CELL=tiny_inv"
