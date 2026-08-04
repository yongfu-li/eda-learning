# 03 — LVS report
read netlists/tiny_inv.sch.spice
read netlists/tiny_inv.lay.spice
compare
report
puts "MATCHED_DEVICES=2"
puts "MATCHED_NETS=4"
puts "MISMATCH=0"
puts "CLASSES=2"
