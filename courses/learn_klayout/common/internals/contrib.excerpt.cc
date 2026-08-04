/* Teaching excerpt — KLayout layMain entry (orientation only) */
#include "layMain.h"
int main(int argc, char **argv) {
  /* batch: klayout -b -r script.drc */
  return layMain::run(argc, argv);
}
