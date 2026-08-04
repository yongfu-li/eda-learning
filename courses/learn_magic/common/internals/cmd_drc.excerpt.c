/* Teaching stub — Magic Tcl command registration (not compiled here). */
/* Upstream pattern: commands/cmd_*.c registers a Tcl proc. */

#include "magic/magic.h"

int
CmdDrc(ClientData clientData, Tcl_Interp *interp, int argc, char *argv[])
{
    /* drc check → scan planes → emit markers */
    Tcl_SetResult(interp, "DRC_ERRORS=1", TCL_STATIC);
    return TCL_OK;
}

/* Register: Tcl_CreateCommand(interp, "drc", CmdDrc, ...); */
