// Teaching excerpt — mirrors Yosys Pass registration shape (not full upstream source).
// Upstream: kernel/register.h + a typical passes/*.cc

struct HelloPass : public Pass {
  HelloPass() : Pass("hello_pass", "print a hello from a demo pass") {}
  void help() override {
    log("\\n    hello_pass [selection]\\n\\n");
  }
  void execute(std::vector<std::string> args, RTLIL::Design *design) override {
    log_header(design, "Executing HELLO_PASS.\\n");
    size_t argidx = 1;
    extra_args(args, argidx, design);
    for (auto module : design->selected_whole_modules_warn()) {
      log("module %s has %zu cells\\n", log_id(module), module->cells().size());
    }
  }
} HelloPass;
// REGISTER_PASS(HelloPass)  // real Yosys uses the REGISTER_PASS macro
