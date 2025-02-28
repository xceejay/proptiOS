#!/bin/bash

while : ; do
sleep 1

isthereanerror=$(tail -n 5 /var/log/neo4j/debug.log | grep -E "exception|fail|error|stop-the-word")

[ -n "$isthereanerror" ] && systemctl restart neo4j.service && sleep 60

## echo "the shit has started" >> /var/log/neo4j/debug.log

unset isthereanerror

done

