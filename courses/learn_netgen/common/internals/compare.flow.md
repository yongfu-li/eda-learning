# Netgen compare flow (teaching)

1. read_sch — parse schematic SPICE subckt
2. read_lay — parse layout/extract SPICE
3. hash_devices — group by device class
4. match_nets — compare net connectivity
5. emit_report — LVS summary (matched/mismatch)

Part B golden: matched_devices=2, matched_nets=4, mismatch=0.
