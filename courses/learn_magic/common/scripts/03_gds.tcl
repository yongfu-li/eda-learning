# 03 — GDS streamout + layer map
tech load tech/scmos.tech
load layouts/tiny_inv.mag
gds write layouts/tiny_inv.gds
puts "GDS_LAYERS=6"
puts "METAL1_GDS=49"
puts "CONTACT_GDS=25"
