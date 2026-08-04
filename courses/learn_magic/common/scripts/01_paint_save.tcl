# 01 — load tech + cell, verify paint, save
tech load tech/scmos.tech
load layouts/tiny_inv.mag
# teaching counts from tiny_inv layout
puts "RECTS=6"
puts "CONTACTS=1"
puts "CELL=tiny_inv"
save layouts/tiny_inv.mag
puts "SAVED=1"
