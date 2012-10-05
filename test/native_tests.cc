#include <stdlib.h>
#include "v8.h"
#include "node.h"
#include "node_buffer.h"

using namespace v8;
using namespace node;

namespace {

/*
 * This "key pressing" example from Wikipedia
 * See: http://en.wikipedia.org/wiki/Bit_field
 */

Handle<Value> KeyPressed(const Arguments &args) {
  HandleScope scope;
  char *ptr = Buffer::Data(args[0].As<Object>());
  int key = args[1]->Int32Value();
  *reinterpret_cast<int *>(ptr) |= key;
  return Undefined();
}

Handle<Value> KeyReleased(const Arguments &args) {
  HandleScope scope;
  char *ptr = Buffer::Data(args[0].As<Object>());
  int key = args[1]->Int32Value();
  *reinterpret_cast<int *>(ptr) &= ~key;
  return Undefined();
}

Handle<Value> IsPressed(const Arguments &args) {
  HandleScope scope;
  char *ptr = Buffer::Data(args[0].As<Object>());
  int key = args[1]->Int32Value();
  return scope.Close(Boolean::New(*reinterpret_cast<int *>(ptr) & key));
}

void Initialize(Handle<Object> target) {
  HandleScope scope;

  NODE_SET_METHOD(target, "keyPressed", KeyPressed);
  NODE_SET_METHOD(target, "keyReleased", KeyReleased);
  NODE_SET_METHOD(target, "isPressed", IsPressed);
}

} // anonymous namespace

NODE_MODULE(binding, Initialize);
