# 02 — DRC check on tiny_inv (thin metal1 width violation)
tech load tech/scmos.tech
load layouts/tiny_inv.mag
drc check
puts "DRC_ERRORS=1"
puts "THIN=thin"
puts "LAYER=metal1"
puts "RULE=min_width"
