#!/bin/bash

if [ $# -le 1 ]
then
  set -x

  certoraRun                                                \
  certora/src/OpenNFTsV4Harness.sol                         \
  certora/src/Receiver.sol                                  \
  --verify OpenNFTsV4Harness:certora/specs/OpenNFTsV4.spec  \
	--optimistic_loop                                         \
  --msg OpenNFTsV4                                          \
  --rule_sanity                                             \
  --packages                                                \
  OpenNFTs/contracts=lib/OpenNFTs/contracts                 \
  $([ $# -ge 1 ] && echo --rule $@)                         \
  # --send_only                                               \

else

  echo "run from project root dir : "
  echo "certora/run/OpenNFTsV4.sh"

fi