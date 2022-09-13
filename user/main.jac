import {*} with "./graph.jac";
import {*} with "./walkers.jac";

walker init {
 root {
       spawn here --> graph::app_graph; 
       spawn --> walker::take_test;
    }
}