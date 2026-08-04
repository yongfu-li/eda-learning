// Teaching stub — not compiled. Mirrors OpenSTA app/ Tcl command shape.
// Upstream: https://github.com/The-OpenROAD-Project/OpenSTA

#include "Sta.hh"

namespace sta {

class HelloCmd : public Cmd
{
public:
  HelloCmd() : Cmd("hello_cmd", "demo contribute command") {}
  int exec(Tcl_Interp *interp) override {
    // print a one-line smoke message
    return TCL_OK;
  }
};

// Register in the app command table (exact API varies by OpenSTA version).
// After CMake rebuild: sta -help hello_cmd

} // namespace sta
