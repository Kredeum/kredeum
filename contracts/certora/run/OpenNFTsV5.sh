#!/bin/bash

if [ $# -le 1 ]
then
  set -x

  certoraRun                                                \
  certora/src/OpenNFTsV5Harness.sol                         \
  certora/src/Receiver.sol                                  \
  --verify OpenNFTsV5Harness:certora/specs/OpenNFTsV5.spec  \
	--optimistic_loop                                         \
  --msg OpenNFTsV5                                          \
  --rule_sanity                                             \
  --packages                                                \
  OpenNFTs/contracts=lib/OpenNFTs/contracts                 \
  $([ $# -ge 1 ] && echo --rule $@)                         \
  # --send_only                                               \

else

  echo "run from project root dir : "
  echo "certora/run/OpenNFTsV5.sh"

fi