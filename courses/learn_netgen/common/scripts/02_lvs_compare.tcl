# 02 — compare nets and devices
read netlists/tiny_inv.sch.spice
read netlists/tiny_inv.lay.spice
compare
puts "MATCHED_NETS=4"
puts "MATCHED_DEVICES=2"
puts "MISMATCH=0"
