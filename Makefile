
.PHONY: all clean test doc

all:
	$(MAKE) -C src

clean:
	cd src && make clean

test:
	cd test && make test

doc:
	cd src && make doc
